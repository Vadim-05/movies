type Props = {
    text: string;
  };
  export function SuccessModal({ text }: Props) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-xl font-bold text-green-400">
          Success 🎉
        </h2>
  
        <p className="text-neutral-300">{text}</p>
      </div>
    );
  }