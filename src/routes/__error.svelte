<script context="module">
    export function load({ error, status }) {
        return {
            props: {
                title: status
            }
        };
    }
  </script>
  
  <script>
    export let title;
  </script>
  <h1 class="text-3xl p-2">{title} error</h1>
  <i class="text-darkgrey">Something went wrong</i>
