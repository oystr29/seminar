import { type PropsWithChildren } from "react";
import { Fragment, type ReactNode } from "react";

type FlashListProps = PropsWithChildren & {
  isFallback?: boolean;
  fallbackRender?: JSX.Element | JSX.Element;
  isLoading?: boolean;
  loadingRender?: JSX.Element | JSX.Element[];
  className?: string;
};

export default function Flashlist({
  isFallback,
  fallbackRender,
  isLoading,
  loadingRender,
  children,
}: FlashListProps) {
  if (isLoading && loadingRender) {
    return <>{loadingRender}</>;
  }

  if (isFallback && fallbackRender) {
    return <>{fallbackRender}</>;
  }

  return <>{children}</>;
}

const Loading = (
  props: PropsWithChildren & { length?: number; keyname?: string },
) => {
  return (
    <>
      {Array.from({ length: props.length ?? 5 }, (_, i) => i).map((i) => (
        <Fragment
          key={props.keyname ? `${props.keyname}-${i}` : `loading-${i}`}
        >
          {props.children}
        </Fragment>
      ))}
    </>
  );
};

function Fastlist<T>(props: {
  data?: T[];
  isLoading?: boolean;
  loading?: JSX.Element;
  fallback?: JSX.Element;
  children: (value: T[]) => ReactNode;
  keyname?: string;
}) {
  const keyname = props.keyname ?? crypto.randomUUID();
  const data = props.data;
  if (props.isLoading && props.loading && !data)
    return <Loading keyname={keyname}>{props.loading}</Loading>;

  if (props.fallback && data?.length === 0 && data) return props.fallback;

  if (props.data) return <>{props.children(props.data)}</>;

  return <div className="text-destructive">Tidak Ada Data</div>;
}

export { Fastlist };
