export const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-md">
      <div className="relative flex items-center justify-center size-24">
        <div className="absolute inset-0 rounded-full border-[3px] border-primary/15" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary animate-spin" />
        <div className="absolute inset-4 rounded-full border-2 border-primary/10" />
        <div className="absolute inset-4 rounded-full border-2 border-transparent border-b-primary/60 animate-spin [animation-direction:reverse] [animation-duration:0.75s]" />
        <div className="size-2.5 rounded-full bg-primary animate-pulse" />
      </div>
    </div>
  );
};
