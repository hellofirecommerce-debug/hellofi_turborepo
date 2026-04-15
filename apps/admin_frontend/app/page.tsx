import LoginBanner from "./(auth)/_components/LoginBanner";
import LoginForm from "./(auth)/_components/LoginForm";

export default function Home() {
  return (
    <div className="relative flex lg:flex-row w-full h-screen max-w-[1600px]  justify-center flex-col bg-white">
      <LoginForm />
      <LoginBanner />
    </div>
  );
}
