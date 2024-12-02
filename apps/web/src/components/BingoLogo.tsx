"use client";
import { useSidebar } from "./ui/sidebar";
import { useRouter } from "next/navigation";

export default function BingoLogo() {
	const { setOpen, setOpenMobile } = useSidebar();
	const router = useRouter();
	return (
		<div
			onClick={() => {
				setOpen(false);
				setOpenMobile(false);
				router.push("/");
			}}
			className="text-3xl md:text-3xl font-bold tracking-tight text-foreground cursor-pointer"
		>
			<span className="text-primary">B</span>
			ingo
		</div>
	);
}
