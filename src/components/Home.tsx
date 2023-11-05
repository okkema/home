import { Image, Segment, Button } from "semantic-ui-react"

function linkStyle(settings: Settings, index: number) {
  if (index === settings.links.length - 1) return undefined
  return {
    borderRadius: 0,
  }
}

export function Home(settings: Settings): JSX.Element {
  return (
    <Segment.Group compact>
      <Segment>
        <Image src={settings.image.src} size={settings.image.size} alt={settings.image.alt} centered />
      </Segment>
      <Segment size="massive" textAlign="center" content={settings.title}/>
      {settings.description && <Segment size="large" textAlign="center" content={settings.description} />}
      {settings.links.map((link, index) => (
        <Button as="a" href={link.href} attached="bottom" size="large" icon={link.icon} content={link.title} color={link.color} style={linkStyle(settings, index)}/>
      ))}
    </Segment.Group>
  )
}
