import type { HeaderLink } from "../../types/header";
import Header from "./Header";

const appLinks: HeaderLink[] = [];

export default function NotFoundHeader() {
  return (
    <>
      <Header
        links={appLinks}
        action={
          <></>
        }
        message={<></>}
      />
    </>
  );
}
