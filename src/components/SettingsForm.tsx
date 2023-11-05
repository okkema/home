import { useState } from "react"
import { useForm, FormProvider, useFieldArray, useFormContext } from "react-hook-form"
import type { FieldError, SubmitHandler } from "react-hook-form"
import { Accordion, Form, type SemanticWIDTHS } from "semantic-ui-react"

const TypeOptions: [OpenGraphType, string][] = [
  ["website", "Website"],
  ["profile", "Profile"],
]

type FieldProps = { 
  name: string 
  label: string
  error?: any
  required?: boolean
  width?: SemanticWIDTHS
  disabled?: boolean
}

type TextFieldProps = FieldProps
function TextField(props: TextFieldProps): JSX.Element {
  const context = useFormContext()
  return <Form.Field required={props.required} width={props.width} error={props.error}>
    <label>{props.label}</label>
    <input {...context.register(props.name)} disabled={props.disabled} />
  </Form.Field>
}

type TextAreaFieldProps = FieldProps & {
  rows?: number
}
function TextAreaField(props: TextAreaFieldProps): JSX.Element {
  const context = useFormContext()
  return <Form.Field required={props.required} width={props.width} error={props.error}>
    <label>{props.label}</label>
    <textarea {...context.register(props.name)} disabled={props.disabled} rows={props.rows}/>
  </Form.Field>
}

type SelectFieldProps = FieldProps & {
  options: [string, string][]
}
function SelectField(props: SelectFieldProps): JSX.Element {
  const context = useFormContext()
  return <Form.Field required={props.required} width={props.width} error={props.error}>
    <label>{props.label}</label>
    <select {...context.register(props.name)} disabled={props.disabled}>
      {props.options.map(function(option) {
        return <option key={option[0]} value={option[0]}>{option[1]}</option>
      })}
    </select>
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
  const context = useForm<Settings>({ defaultValues: settings })
  const links = useFieldArray({ 
    control: context.control,
    name: "links",
  })
  const onSubmit: SubmitHandler<Settings> = function(data) {
    console.log(data)
  }
  const errors = context.formState.errors
  return <FormProvider {...context}>
    <Form onSubmit={context.handleSubmit(onSubmit)}>
      <Form.Group widths={3}>
        <TextField name="author.name" label="Author Name" required error="this is an error" />
        <TextField name="author.email" label="Author Email" required />
      </Form.Group>
      <Form.Group widths={3}>
        <SelectField name="type" label="Type" options={TypeOptions} required />
        <TextField name="title" label="Title" required />
        <TextField name="url" label="URL" disabled />
      </Form.Group>
      <TextAreaField name="description" label="Description" rows={3} />
      <Expandable title="Links" active={!!settings.links.length}>
        {links.fields.map(function(link, index) {
          return <Form.Group key={link.id} widths={3}>
            <TextField name={`links.${index}.title`} label="Title" required />
            <TextField name={`links.${index}.href`} label="href" required />
            <TextField name={`links.${index}.icon`} label="Icon" />
          </Form.Group>
        })}
      </Expandable>
    </Form>
  </FormProvider>
}