import { ref, computed, nextTick } from 'vue';
import { BaseBarrage } from '../../lib/index.ts';
import { ElInput } from 'element-plus';

export default function useDisable() {
  // 弹幕禁用类型
  const barrageRenderList = ref([
    {key: 'scroll', label: '滚动', value: true, judge: (barrage: BaseBarrage) => barrage.barrageType === 'scroll'},
    {key: 'top', label: '顶部', value: true, judge: (barrage: BaseBarrage) => barrage.barrageType === 'top'},
    {key: 'bottom', label: '底部', value: true, judge: (barrage: BaseBarrage) => barrage.barrageType === 'bottom'},
    {
      key: 'color',
      label: '彩色',
      value: true,
      judge: (barrage: BaseBarrage) => !(typeof barrage.color === 'string' && ['#FFFFFF', '#000000'].includes(barrage.color))
    },
    {key: 'senior', label: '高级', value: true, judge: (barrage: BaseBarrage) => barrage.barrageType === 'senior'}
  ]);
  const disableJudges = computed(() => barrageRenderList.value.filter(item => !item.value).map(item => item.judge));

  // 屏蔽等级
  const shieldGrade = ref(1);

  // 屏蔽词相关
  const shieldWords = ref<string[]>([]);
  // 是否展开 drawer
  const isOpenDrawer = ref(false);
  const handleClose = (tag: string) => {
    shieldWords.value.splice(shieldWords.value.indexOf(tag), 1);
  };
  const shieldWordInputVisible = ref(false);
  const shieldWordInputValue = ref('');
  const handleInputConfirm = () => {
    if (shieldWordInputValue.value) {
      shieldWords.value.push(shieldWordInputValue.value);
    }
    shieldWordInputVisible.value = false;
    shieldWordInputValue.value = '';
  };
  const InputRef = ref<InstanceType<typeof ElInput>>();
  const showInput = async () => {
    shieldWordInputVisible.value = true;
    await nextTick();
    InputRef.value!.input!.focus();
  };

  return {
    // 弹幕禁用类型
    barrageRenderList,
    disableJudges,
    // 屏蔽等级
    shieldGrade,
    // 屏蔽词相关
    shieldWords,
    isOpenDrawer,
    handleClose,
    shieldWordInputVisible,
    shieldWordInputValue,
    handleInputConfirm,
    InputRef,
    showInput,
  }
}
