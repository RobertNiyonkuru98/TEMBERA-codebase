import RolePlaceholderPage from "./RolePlaceholderPage";

function VisitorShowcasePage() {
  return (
    <RolePlaceholderPage
      title="Visitor Showcase"
      subtitle="This page is focused on discovery and client attraction content."
      items={[
        "Featured destinations and curated offers",
        "Trust signals, reviews, and partner highlights",
        "Clear calls-to-action for sign-up and booking",
      ]}
    />
  );
}

export default VisitorShowcasePage;
