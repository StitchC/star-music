<template>
  <div class="recommend-wrapper">

  </div>
</template>

<script type="text/ecmascript-6">
  import getRecommend from 'api/getRecommend.js';
  import {ERR_OK} from 'api/config.js';

  export default {
    created() {
       this._getRecommend();
    },
    methods: {
      _getRecommend() {
        getRecommend().then((res) => {
          if(res.code === ERR_OK) {
            console.log(res.data);
          }
        });
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
