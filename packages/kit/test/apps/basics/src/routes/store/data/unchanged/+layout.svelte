<script>
	import { page } from '$app/stores';
	let previous = $page.data;
	let count = 0;
	$: {
		if (previous !== $page.data) {
			count++;
		}
	}
</script>

<p>$page.data was updated {count} time(s)</p>
<a href="/store/data/unchanged/a">a</a>
<a href="/store/data/unchanged/b">b</a>
