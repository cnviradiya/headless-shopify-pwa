<template>
  <div>
    <Loader />
    <Header />
    <main>
      <nuxt />
    </main>
    <Footer />
  </div>
</template>

<script>
// import { getCLS } from 'web-vitals'
import Loader from '~/components/Blocks/Loader'
import Header from '~/components/Blocks/Header'
import Footer from '~/components/Blocks/Footer'

export default {
  components: {
    Loader,
    Header,
    Footer
  },
  mounted() {
    // eslint-disable-next-line
    // getCLS(console.log)
    // eslint-disable-next-line
    // getFID(console.log)
    // eslint-disable-next-line
    // getLCP(console.log)
  }
}
</script>
