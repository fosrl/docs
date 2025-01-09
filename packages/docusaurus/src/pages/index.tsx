import { useEffect } from "react";

export default function Home(): JSX.Element {
  useEffect(() => {
    // redirect to /overview
    window.location.href = "/overview";
  });

  return <></>;
}
