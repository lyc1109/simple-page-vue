/**
 * vee-validate 校验扩展
 *
 * @author  hucw
 * @created 2017-06-16
 */

export default [
  {
    name: "mobile",
    rule: {
      messages: {
        'zh_CN': (field, args) => "请输入正确的手机号码"
      },
      validate(value, args) {
        return value.length === 11 && /^((13|14|15|16|17|18)[0-9]\d{8})|(199\d{8})$/.test(value)
      }
    }
  }
]
