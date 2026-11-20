<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.ts';

	let {
		user,
		userId
	}: {
		user: { id: string; name: string; email: string; role: string } | undefined;
		userId: string;
	} = $props();
</script>

<Card.Card>
	<Card.CardHeader>
		<Card.CardTitle>{user?.name}</Card.CardTitle>
		<Card.CardDescription>getUserById('{userId}')</Card.CardDescription>
	</Card.CardHeader>
	<Card.CardContent>
		<div class="space-y-1 text-sm">
			<div><strong>Email:</strong> {user?.email}</div>
			<div><strong>Role:</strong> {user?.role}</div>
		</div>
	</Card.CardContent>
</Card.Card>
