<template>
  <div id="nav">
    <router-link to="/">HOME</router-link>
    <router-link to="/expenses">EXPENSES</router-link>
    <router-link to="/incomes">INCOMES</router-link>
    <router-link to="/savings">SAVINGS</router-link>
    <router-link to="/account">ACCOUNT</router-link>
  </div>
</template>

<style>
#nav {
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 0.2em 1em;
  background: linear-gradient(to right, #6fee1b, #84cf6a);
}

.nav-welcome {
  margin-left: auto;
  margin-right: 1rem;
  color: white;
}

a {
  font-weight: bold;
  color: #2c3e50;
  margin: auto 0.8em auto 0.4em;
  text-decoration: none;
  border-top: 2px solid transparent;
  border-bottom: 2px solid transparent;
}

.router-link-exact-active {
  color: white;
  border-bottom: 2px solid #fff;
}

.button,
button {
  margin-left: auto;
  cursor: pointer;
}

.nav-welcome + button {
  margin-left: 0;
}
</style>
