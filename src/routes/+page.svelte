<script lang="ts">
  const { data } = $props();
</script>

{#if data.user}
  <h1>Welcome, {data.user.name}!</h1>
  <p>Email: {data.user.email}</p>
  <form method="post" action="/auth/logout">
    <button type="submit">Logout</button>
  </form>
{:else}
  <h1>AuthAction SvelteKit Example</h1>
  <a href="/auth/login">Login with AuthAction</a>
{/if}
