import { useForm, FormProvider, useFieldArray, useFormContext } from "react-hook-form"
import type { FieldError, SubmitHandler } from "react-hook-form"
import { Button, Form, Header, Label, Segment, type SemanticWIDTHS } from "semantic-ui-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createRef } from "react"

const TypeOptions: [OpenGraphType, string][] = [
  ["website", "Website"],
  ["profile", "Profile"],
]

const ColorOptions: [SemanticCOLORS | "", string][] = [
  ["", ""],
  ["black", "Black"],
  ["blue", "Blue"],
  ["brown", "Brown"],
  ["green", "Green"],
  ["grey", "Grey"],
  ["olive", "Olice"],
  ["orange", "Orange"],
  ["pink", "Pink"],
  ["purple", "Purple"],
  ["red", "Red"],
  ["teal", "Teal"],
  ["violet", "Violet"],
  ["yellow", "Yellow"],
]

const SizeOptions: [SemanticSIZES, string][] = [
  ["mini", "Mini"],
  ["tiny", "Tiny"],
  ["small", "Small"],
  ["medium", "Medium"],
  ["large", "Large"],
  ["big", "Big"],
  ["huge", "Huge"],
  ["massive", "Massive"],
]

const EmptyLink: Link = {
  title: "",
  href: "",
  icon: "",
  color: "",
}

const SettingsSchema = z.object({
  type: z.string(),
  title: z.object({
    value: z.string().trim().min(1, { message: "Title is required" }),
    visible: z.boolean(),
  }),
  description: z.object({
    value: z.string().trim().min(1, { message: "Description is required" }),
    visible: z.boolean(),
  }),
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
  return <Form.Field required={required} width={width} error={error}>
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

type CheckboxFieldProps = FieldProps
function CheckboxField({ name, label, error, required, width, disabled, }: CheckboxFieldProps): JSX.Element {
  const context = useFormContext()
  return <Form.Field error={error} required={required} width={width} inline>
    <label>{label}</label>
    <input type="checkbox" {...context.register(name)} disabled={disabled} />
    {error && <Label content={error.message} pointing prompt />}
  </Form.Field>
}

export function SettingsForm(settings: Settings): JSX.Element {
  const fileInput = createRef<HTMLInputElement>()
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
    window.location.href = "/"
  }
  async function handleChangeFile() {
    const file = fileInput.current!.files![0]
    const formData = new FormData()
    formData.append("file", file)
    const response = await fetch("/edit/image", {
      method: "POST",
      body: formData,
    })
    const json = await response.json<{ path: string }>()
    const url = `${window.location.protocol}//${window.location.host}${json.path}`
    context.setValue("image.src", url)
  }
  const errors = context.formState.errors
  return <FormProvider {...context}>
    <Form onSubmit={context.handleSubmit(onSubmit)} error={!context.formState.isValid} style={{ height: "100%" }}>
      <Header as="h3" attached="top" content="Content" subheader="Content is visible and the main component of the home page." />
      <Segment attached>
        <Form.Group widths={2}>
          <TextField name="title.value" label="Title" error={errors.title?.value} required />
          <TextField name="url" label="URL" error={errors.url} disabled />
        </Form.Group>
        <TextAreaField name="description.value" label="Description" error={errors.description?.value} rows={3} required />
        <Form.Group>
          <CheckboxField name="title.visible" label="Show Title" />
          <CheckboxField name="description.visible" label="Show Description" />
        </Form.Group>
        <Form.Group widths={3}>
          <Form.Field>
            <label htmlFor="file">Image</label>
            <input
              type="file"
              id="file"
              accept=".jpg,.jpeg,.png,.gif,.webp"
              onChange={handleChangeFile}
              ref={fileInput}
            />
          </Form.Field>
          <TextField name="image.alt" label="Alt" error={errors.image?.alt} />
          <SelectField name="image.size" label="Size" error={errors.image?.size} options={SizeOptions} />
        </Form.Group>
        <TextField name="image.src" label="src" error={errors.image?.src} />
      </Segment>
      <Segment attached clearing>
        <Header as="h3" content="Links" floated="left" style={{ marginBottom: 0 }} subheader="Add or remove links that appear beneath the main content." />
        <Button icon="plus" floated="right" content="Add" onClick={function() { links.append(EmptyLink) }} primary />
      </Segment>
      <Segment attached>
        {links.fields.map(function(link, index) {
          return <Segment clearing>
            <Form.Group key={link.id} widths={4}>
              <TextField name={`links.${index}.title`} label="Title" error={errors.links?.[index]?.title} required />
              <TextField name={`links.${index}.href`} label="href" error={errors.links?.[index]?.href} required />
              <TextField name={`links.${index}.icon`} label="Icon" error={errors.links?.[index]?.icon} />
              <SelectField name={`links.${index}.color`} label="Color" error={errors.links?.[index]?.color} options={ColorOptions} />
            </Form.Group>
            <Button icon="trash" floated="right" content="Remove" onClick={function() { links.remove(index) }} secondary />
          </Segment> 
        })}
      </Segment>
      <Header as="h3" attached content="Metadata" subheader="Metadata is hidden from view used in search results and social posting." />
      <Segment attached>
        <Form.Group widths={3}>
          <SelectField name="type" label="Type" options={TypeOptions} error={errors.type} required />
          <TextField name="author.name" label="Author Name" error={errors.author?.name} required />
          <TextField name="author.email" label="Author Email" error={errors.author?.email} required />
        </Form.Group>
      </Segment>
      <Segment clearing attached>
        <Button.Group floated="right">
          <Button content="Cancel" icon="undo" onClick={function() { window.location.href = "/" }} secondary />
          <Button type="submit" content="Save" icon="save" primary />
        </Button.Group>
      </Segment>
    </Form>
  </FormProvider>
}