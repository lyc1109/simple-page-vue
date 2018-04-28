<template>
  <div>
    <v-date-picker class="form-field required"
                   name="serviceDate"
                   label="预约日期"
                   v-model="serviceDate"
                   placeholder="请选择预约日期"
                   :defaultVal="serviceTimeData.startDate"
                   :startDate="serviceTimeData.startDate"
                   :endDate="serviceTimeData.endDate"></v-date-picker>
    <v-selector class="form-field required"
                name="serviceTime" label="预约时间" placeholder="请选择预约时间"
                :data="serviceTimeData.times"
                :value="defaultTime"
                v-model="serviceTime"
                v-validate="'required'"
                data-vv-as="预约时间"
                :error-msg="errors.first('serviceTime')"></v-selector>
  </div>
</template>
<script>
  import VSelector from '@/components/ui/v-selector'
  import VDatePicker from '@/components/ui/v-date-picker'
  import OrderUtils from '@/assets/scripts-page/order-utils'

  export default {
    name: 'tpl-form-servicetime',
    components: {
      VSelector,
      VDatePicker
    },
    data: function () {
      return {
        serviceDate: "",
        serviceTime: ""
      }
    },
    computed: {
      serviceTimeData: function () {
        const startDate = OrderUtils.getServiceStartDate();
        const data = {
          startDate: startDate,
          endDate: OrderUtils.getServiceEndDate(),
          times: OrderUtils.getServiceDate(startDate)
        };
        this.serviceDate = this.$filters.formatDate(data.startDate);
        this.serviceTime = data.times[0];
        return data;
      }
    },
    watch: {
      serviceDate(val){
        this.$emit("onChange", val, this.serviceTime);
      },
      serviceTime(val){
        this.$emit("onChange", this.serviceDate, val);
      }
    }
  }
</script>
