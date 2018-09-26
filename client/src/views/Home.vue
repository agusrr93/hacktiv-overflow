<template>
    <div class="home">
        <div class="container">
            <div class="row">

                <div class="col-lg-3 mt-5">
                    <Sidebar/>
                </div>

                <div class="col-md-8 mt-5">
                    <router-view/>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '../components/Sidebar'

export default {
  components: {
    Sidebar
  }
}
</script>
