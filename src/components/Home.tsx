import { Image, Segment, Button } from "semantic-ui-react"

export function Home(settings: Settings): JSX.Element {
  return (
    <Segment.Group compact>
      <Segment>
        <Image src={settings.image.src} size={settings.image.size} centered />
      </Segment>
      <Segment size="massive" textAlign="center">{settings.title}</Segment>
      <Segment size="large" textAlign="center">{settings.description}</Segment>
      {settings.links.map(link => (
        <a href={link.href}>
          <Button attached="bottom">{link.title}</Button>
        </a>
      ))}
    </Segment.Group>
  )
}