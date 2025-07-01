<template>
  <section class="hero text-center section-padding">
    <div class="container">
      <div class="hero-block margin-bottom-xl">
        <h1>
          We're all about<br />
          <strong class="highlight-text">
            <span class="text">consumer reviews</span>
            <img src="../../assets/images/stars-blink.gif" alt="Celebration" class="inline-gif" />
          </strong>
        </h1>
        <p>Get the story behind the star rating with authentic reviews from <br />real customers</p>
      </div>

      <slot name="actions"></slot>
      <slot name="search"></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
};
</script>

<style scoped>
.hero h1 {
  margin-bottom: var(--spacing-md);
}

.hero p {
  font-size: 20px;
  color: var(--color-light-text);
  margin-bottom: var(--spacing-xxl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.highlight-text {
  display: inline-flex;
  align-items: center;
  position: relative;
  gap: 0.5rem;
}

.inline-gif {
  width: 66px;
  height: auto;
  position: absolute;
  left: 93%;
  top: -10px;
  transform: rotate(-10deg);
  pointer-events: none;
  z-index: 2;
}

@media (max-width: 640px) {
  .highlight-text {
    flex-direction: column;
    align-items: center;
  }

  .inline-gif {
    position: static;
    transform: none;
    margin-top: 0.25rem;
  }
}
</style>