// 条件分支图形样式
export const condDescParam = {
  type: "cond-desc",
  name: "",
  value: "",
  icon: "arrow-down",
  style: {}
};
// 纯文字样式
export const inputTextParam = {
  type: "input-text",
  name: "",
  value: "",
  required: true,
  // placeholder:'',
  // warning:'',
  // disabled: false,
  style: {}
};
export const inputParam = {
  type: "input",
  value: "",
  placeholder: "",
  warning: "",
  disabled: false,
  style: {}
};
export const selectParam = {
  type: "select",
  value: "String",
  options: [
    { label: "String", value: "String" },
    { label: "Integer", value: "Integer" }
  ],
  placeholder: "",
  noDataText: "暂无数据",
  warning: "",
  disabled: false,
  style: {}
};
export const textareaParam = {
  type: "textarea",
  value: "",
  placeholder: "",
  warning: "",
  showWordLimit: true,
  maxlength: 1000,
  disabled: false,
  style: {}
};

export const checkBoxParam = {
  type: "checkbox",
  value: "",
  selected: true,
  placeholder: "",
  warning: "",
  disabled: false,
  style: {}
};
export const deleteIconParam = {
  type: "delete-icon",
  disabled: false,
  style: {}
};
