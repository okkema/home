export const DemoSettings: Settings = {
	author: {
		name: "Okkema Labs",
		email: "correos@okkema.org"
	},
	og: "website",
	schema: "Organization",
	url: "",
	title: {
		value: "Home Page Generator",
		visible: true,
	},
	description: {
		value: "Navigate to \"/edit\" to configure settings",
		visible: true,
	},
	location: {
		value: "Planet Earth",
		visible: true,
	},
	image: {
		src: "/logo.png",
		size: "small",
		alt: "Okkema Labs Official Logo"
	},
	links: [
    {
      title: "Repository",
      href: "https://github.com/okkema/home",
      icon: "github",
      color: "black"
    }
	]
}
