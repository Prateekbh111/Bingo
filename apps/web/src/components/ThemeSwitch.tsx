"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import { useEffect, useState } from "react";

export default function ThemeSwitch() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;
	return (
		<div className="flex gap-2 lg:gap-4">
			<Sun className={`${theme === "light" && "text-green-500"}`} />
			<Switch
				checked={theme == "dark"}
				onCheckedChange={() => {
					setTheme(theme === "dark" ? "light" : "dark");
				}}
			/>
			<Moon className={`${theme === "dark" && "text-green-500"}`} />
		</div>
	);
}
