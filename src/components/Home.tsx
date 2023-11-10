import { Image, Segment, Button } from "semantic-ui-react"

export function Home(settings: Settings): JSX.Element {
  return (
    <Segment.Group compact>
      <Segment attached>
        <Image 
          alt={settings.image.alt} 
          size={settings.image.size} 
          src={settings.image.src} 
          centered 
        />
      </Segment>
      {settings.title.visible && 
          <Segment 
          content={settings.title.value}
          size="massive" 
          textAlign="center"
          attached 
        />}
      {settings.description.visible && 
        <Segment 
          content={settings.description.value}
          size="large" 
          textAlign="center" 
          attached
        />}
      {settings.links.map(function(link, index) {
        return <Button 
          as="a" 
          attached={index === settings.links.length - 1 ? "bottom" : true} 
          color={link.color === "" ? undefined : link.color} 
          content={link.title} 
          href={link.href} 
          icon={link.icon} 
          size="large" 
        />
      })}
    </Segment.Group>
  )
}
