"use client";
import { SignalHigh, SignalLow, SignalMedium, SignalZero } from "lucide-react";
import { ReactElement, useEffect, useState } from "react";

interface NetworkInformation extends EventTarget {
	downlink: number;
	effectiveType: string;
	saveData: boolean;
	onchange: EventListener | null;
}

export default function SignalIcon() {
	const [speed, setSpeed] = useState<number>(0);

	useEffect(() => {
		const interval = setInterval(() => getNetworkSpeed(), 1000);
		return () => clearInterval(interval);
	});

	function getNetworkSpeed() {
		if ("connection" in navigator) {
			const connection = navigator.connection as NetworkInformation;
			const downlinkSpeed = connection.downlink;
			console.log(downlinkSpeed);
			setSpeed(downlinkSpeed);
		} else {
			console.log("Network Information API is not supported on this device.");
		}
	}
	return (
		<>
			{speed >= 10 && <SignalHigh />}
			{speed >= 5 && speed < 10 && <SignalMedium />}
			{speed >= 2 && speed < 5 && <SignalLow />}
			{speed < 2 && <SignalZero />}
		</>
	);
}
