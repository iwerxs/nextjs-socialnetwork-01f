//src/components/InfiniteScrollContainer.tsx
// trigger to load data for the next page
import { useInView } from "react-intersection-observer";

interface InfiniteScrollContainerProps extends React.PropsWithChildren {
  onBottomReached: () => void;
  className?: string;
}

export default function InfiniteScrollContainer({
  children,
  onBottomReached,
  className,
}: InfiniteScrollContainerProps) {
  const { ref } = useInView({
    // callback
    rootMargin: "200px",
    onChange(inView) {
      if (inView) {
        onBottomReached();
      }
    },
  });

  return (
    <>
      <div className={className}>
        {children}
        <div ref={ref} />
      </div>
    </>
  );
}
