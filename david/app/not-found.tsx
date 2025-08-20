export default function NotFound() {
	return (
		<div className="min-h-[40vh] flex flex-col items-center justify-center gap-2 text-center">
			<h2 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
			<p className="text-muted-foreground">요청하신 페이지가 존재하지 않거나 이동되었어요.</p>
		</div>
	)
} 