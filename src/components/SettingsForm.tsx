import { useState } from "react"
import { useForm, FormProvider, useFieldArray, useFormContext } from "react-hook-form"
import type { FieldError, SubmitHandler } from "react-hook-form"
import { Accordion, Button, Form, Label, type SemanticWIDTHS } from "semantic-ui-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const TypeOptions: [OpenGraphType, string][] = [
  ["website", "Website"],
  ["profile", "Profile"],
]

const SettingsSchema = z.object({
  type: z.string(),
  title: z.string().trim().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  author: z.object({
    name: z.string().trim().min(1, { message: "Author Name is required" }),
    email: z.string().email().trim().min(1, { message: "Author Email is required" }),
  }).required(),
  url: z.string().url().trim().min(1, { message: "URL is required" }),
  image: z.object({
    src: z.string().trim().min(1, { message: "Image src is required" }),
    size: z.string().trim().min(1, { message: "Image Size is required" }),
    alt: z.string().trim().min(1, { message: "Image Alt is required" }),
  }).required(),
  links: z.array(z.object({
    title: z.string().trim().min(1, { message: "Link Title is required" }),
    href: z.string().trim().min(1, { message: "Link href is required" }),
    icon: z.string(),
    color: z.string(),
  })).optional(),
})

type FieldProps = { 
  name: string 
  label: string
  error?: FieldError
  required?: boolean
  width?: SemanticWIDTHS
  disabled?: boolean
}

type TextFieldProps = FieldProps
function TextField({ name, label, error, required, width, disabled, }: TextFieldProps): JSX.Element {
  const context = useFormContext()
  return <Form.Field required={required} width={width} error={!!error}>
    <label>{label}</label>
    <input {...context.register(name, { required })} disabled={disabled} />
    {error && <Label content={error.message} pointing prompt />}
  </Form.Field>
}

type TextAreaFieldProps = FieldProps & {
  rows?: number
}
function TextAreaField({ name, label, error, required, width, disabled, rows, }: TextAreaFieldProps): JSX.Element {
  const context = useFormContext()
  return <Form.Field required={required} width={width} error={error}>
    <label>{label}</label>
    <textarea {...context.register(name, { required, })} disabled={disabled} rows={rows}/>
    {error && <Label content={error.message} pointing prompt />}
  </Form.Field>
}

type SelectFieldProps = FieldProps & {
  options: [string, string][]
}
function SelectField({ name, label, error, required, width, disabled, options, }: SelectFieldProps): JSX.Element {
  const context = useFormContext()
  return <Form.Field required={required} width={width} error={error}>
    <label>{label}</label>
    <select {...context.register(name)} disabled={disabled}>
      {options.map(function(option) {
        return <option key={option[0]} value={option[0]}>{option[1]}</option>
      })}
    </select>
    {error && <Label content={error.message} pointing prompt />}
  </Form.Field>
}

type ExpandableProps = {
  children: JSX.Element | JSX.Element[]
  title: string
  active?: boolean
  disabled?: boolean
}
function Expandable(props: ExpandableProps): JSX.Element {
  const [active, setActive] = useState(props.active ?? false)
  const onClick = props.disabled ? undefined : function() {
    setActive(function(current) {
      return !current
    })
  }
  return <Accordion as={Form.Field}>
    <Accordion.Title active={active} onClick={onClick} content={props.title} />
    <Accordion.Content active={active} children={props.children} />
  </Accordion>
}

export function SettingsForm(settings: Settings): JSX.Element {
  const context = useForm<Settings>({ defaultValues: settings, resolver: zodResolver(SettingsSchema) })
  const links = useFieldArray({ 
    control: context.control,
    name: "links",
  })
  const onSubmit: SubmitHandler<Settings> = async function(data) {
    await fetch("/edit/save", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  const errors = context.formState.errors
  return <FormProvider {...context}>
    <Form onSubmit={context.handleSubmit(onSubmit)} error={!context.formState.isValid}>
      <Form.Group widths={3}>
        <TextField name="author.name" label="Author Name" error={errors.author?.name} required />
        <TextField name="author.email" label="Author Email" error={errors.author?.email} required />
      </Form.Group>
      <Form.Group widths={3}>
        <SelectField name="type" label="Type" options={TypeOptions} error={errors.type} required />
        <TextField name="title" label="Title" error={errors.title} required />
        <TextField name="url" label="URL" error={errors.url} disabled />
      </Form.Group>
      <TextAreaField name="description" label="Description" rows={3} />
      <Expandable title="Links" active={!!settings.links.length}>
        {links.fields.map(function(link, index) {
          return <Form.Group key={link.id} widths={3}>
            <TextField name={`links.${index}.title`} label="Title" error={errors.links?.[index]?.title} required />
            <TextField name={`links.${index}.href`} label="href" error={errors.links?.[index]?.href} required />
            <TextField name={`links.${index}.icon`} label="Icon" error={errors.links?.[index]?.icon} />
          </Form.Group>
        })}
      </Expandable>
      <Button floated="right" type="submit" content="Save" />
    </Form>
  </FormProvider>
}