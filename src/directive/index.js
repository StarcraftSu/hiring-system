
import Vue from 'vue'
import store from '@/store/index'
Vue.directive("perms", {
    bind(el, binding) {
        let perms = store.state.perms.permsList;//按钮权限指令
        
        if(perms!='*'){
            if(perms.indexOf(binding.value)<0){
                el.parentNode.removeChild(el);//权限不通过删除元素
            }else{
                return false
            }
        }else{
            return false
        }  
         console.log(el);
        console.log(perms);
        console.log(binding);
    }
});