<template>
  <Teleport to="#void">
    <slot />
  </Teleport>
</template>

<script>
if (document && !document.getElementById('void')) {
  const voidElement = document.createElement('div');
  voidElement.id = 'void';
  voidElement.style.width = 0;
  voidElement.style.height = 0;
  voidElement.style.opacity = 0;
  voidElement.style.display = 'none';
  document.body.appendChild(voidElement);
}
export default {};
</script>
