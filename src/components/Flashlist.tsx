import { type PropsWithChildren } from "react";

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
