"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { BingoCell } from "@/types/types";

export default function BingoCard({
	card,
	isGameStarted,
	isDisable,
	lastNumber,
	handleCellClick,
}: {
	card: BingoCell[][];
	isGameStarted: boolean;
	isDisable: boolean;
	lastNumber: number | null;
	handleCellClick: (row: number, col: number) => void;
}) {
	const [cellSize, setCellSize] = useState(56);

	function updateCellSize(containerWidth: number) {
		const newSize = Math.floor((containerWidth - 30) / 5);
		setCellSize(Math.max(newSize, 56));
	}
	return (
		<Card
			className={`w-full dark:bg-card bg-neutral-100 border-2 ${isGameStarted && "rounded-none md:rounded-md"}`}
		>
			<CardContent className="p-4">
				<div
					className="grid grid-cols-5 gap-1 md:gap-2"
					ref={(el) => {
						if (el) {
							const resizeObserver = new ResizeObserver((entries) => {
								for (const entry of entries) {
									updateCellSize(entry.contentRect.width);
								}
							});
							resizeObserver.observe(el);
							return () => resizeObserver.disconnect();
						}
					}}
				>
					{card.map((row, rowIndex) =>
						row.map((cell, cellIndex) => (
							<Button
								key={`${rowIndex}-${cellIndex}`}
								onClick={() => handleCellClick(rowIndex, cellIndex)}
								variant={cell.marked ? "default" : "outline"}
								className={`p-0 font-bold text-lg ${
									cell.marked && "bg-primary text-primary-foreground"
								} ${lastNumber && cell.number === lastNumber && "ring-[3px] dark:ring-neutral-400 ring-neutral-600"}`}
								style={{
									width: `${cellSize}px`,
									height: `${cellSize}px`,
								}}
								disabled={isDisable || cell.marked}
							>
								{cell.number}
							</Button>
						)),
					)}
				</div>
			</CardContent>
		</Card>
	);
}
