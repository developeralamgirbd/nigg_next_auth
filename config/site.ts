export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Docusearch AI",
  description:
    "Chatbot for technical documentation. Powered by GPT-4 and Data Science Engineer.",
  mainNav: [
 
    {
      title: "Sign In",
      href: "/signin",
    },
  ],
  authMainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Input",
      href: "/input",
    }
  ],
  
  links: {
    linkedin: "https://www.linkedin.com/in/andreasniggdatascientist",
    twitter: "https://twitter.com/techscienceandy",
  },
}
