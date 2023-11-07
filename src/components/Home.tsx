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
        <Image 
          alt={settings.image.alt} 
          size={settings.image.size} 
          src={settings.image.src} 
          centered 
        />
      </Segment>
      <Segment 
        content={settings.title}
        size="massive" 
        textAlign="center" 
      />
      {settings.description && 
        <Segment 
          content={settings.description}
          size="large" 
          textAlign="center" 
        />}
      {settings.links.map(function(link, index) {
        return <Button 
          as="a" 
          attached="bottom" 
          color={link.color} 
          content={link.title} 
          href={link.href} 
          icon={link.icon} 
          size="large" 
          style={linkStyle(settings, index)}
        />
      })}
    </Segment.Group>
  )
}
