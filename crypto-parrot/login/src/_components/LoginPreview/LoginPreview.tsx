import VerticalCutReveal from "@/components/fancy/vertical-cut-reveal";

interface PreviewProps {
  error: string | null;
  userExists: boolean | null;
}

export default function Preview({ error, userExists }: PreviewProps) {
  let message = "";

  if (error) {
    message = "🛑 Squawk! Something went wrong. Please try again.";
  } else if (userExists === true) {
    message = "🦜 Squawk! You’re all set up and ready to use Crypto Parrot.";
  } else if (userExists === false) {
    message = "🦜 Squawk! Registering you now… hang tight!";
  } else {
    message = "🦜 Hold on, checking your status…";
  }

  return (
    <div className="w-full h-full text-lg md:text-2xl flex flex-col items-start justify-center font-calendas p-10 md:p-16 lg:p-24 bg-primaryBlue text-black tracking-wide font-bold">
      <div className="flex flex-col justify-center w-full items-center space-y-4">
        <VerticalCutReveal
          splitBy="words"
          staggerDuration={0.1}
          staggerFrom="first"
          reverse={true}
          transition={{
            type: "repeat",
            stiffness: 250,
            damping: 30,
            delay: 0,
          }}
        >
          {message}
        </VerticalCutReveal>
      </div>
    </div>
  );
}