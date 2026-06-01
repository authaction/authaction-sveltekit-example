<script lang="ts">
  const { data } = $props();
</script>

<h1>Dashboard</h1>
<p>Welcome, {data.user.name}!</p>
<p>Email: {data.user.email}</p>
<form method="post" action="/auth/logout">
  <button type="submit">Logout</button>
</form>
