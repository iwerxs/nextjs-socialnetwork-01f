//src/components/Linkify.tsx
import Link from "next/link";
import { LinkIt, LinkItUrl } from "react-linkify-it";
import UserLinkWithTooltip from "./UserLinkWithTooltip";
import { match } from "assert";

interface LinkifyProps {
  children: React.ReactNode;
}

export default function Linkify({ children }: LinkifyProps) {
  return (
    <>
      <LinkItUrl>{children}</LinkItUrl>
    </>
  );
}

function LinkifyUrl({ children }: LinkifyProps) {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );
}

function LinkifyUsername({ children }: LinkifyProps) {
  return (
    <>
      <LinkIt
        regex={/(@[a-zA-Z0-9_-]+)/}
        component={(match, key) => (
          <UserLinkWithTooltip key={key} username={match.slice(1)}>
            {match}
          </UserLinkWithTooltip>
          // <Link
          //   key={key}
          //   href={`/users/${match.slice(1)}`}
          //   className="text-primary hover:underline"
          // >
          //   {children}
          // </Link>
        )}
      >
        {children}
      </LinkIt>
    </>
  );
}

function LinkifyHashtag({ children }: LinkifyProps) {
  return (
    <>
      <LinkIt
        regex={/(#[a-zA-Z0-9]+)/}
        component={(match, key) => (
          <Link
            key={key}
            href={`/hashtag/${match.slice(1)}`}
            className="text-primary hover:underline"
          >
            {match}
          </Link>
        )}
      >
        {children}
      </LinkIt>
    </>
  );
}
