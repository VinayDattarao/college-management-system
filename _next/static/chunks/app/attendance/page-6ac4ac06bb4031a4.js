(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[881],{1351:function(e,t,r){Promise.resolve().then(r.bind(r,3835))},3835:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return d}});var a=r(3827),s=r(4090),n=r(7907),l=r(580);function d(){var e;let t=(0,n.useRouter)(),[r,d]=(0,s.useState)(!1),[o,c]=(0,s.useState)([]),[i,u]=(0,s.useState)(""),[g,m]=(0,s.useState)(""),[x,h]=(0,s.useState)([]),[b,p]=(0,s.useState)([]),[y,f]=(0,s.useState)(new Date().toISOString().split("T")[0]),[j,v]=(0,s.useState)(!0),[w,k]=(0,s.useState)(""),[N,S]=(0,s.useState)(""),[O,I]=(0,s.useState)(null),[C,E]=(0,s.useState)([]),[P,A]=(0,s.useState)(!1),[D,L]=(0,s.useState)("");(0,s.useEffect)(()=>{let e="true"===localStorage.getItem("darkMode");d(e),document.documentElement.classList.toggle("dark",e);let r=localStorage.getItem("userRole"),a=localStorage.getItem("rollNumber"),s=localStorage.getItem("classroomId");if(!r){t.push("/");return}k(r),a&&S(a),(async()=>{v(!0);try{if(await M(),"student"===r&&s){let e=localStorage.getItem("classrooms");if(e){let t=JSON.parse(e).find(e=>e.id===s);t&&I(t)}}else await R()}catch(e){console.error("Error loading data:",e)}finally{v(!1)}})()},[]),(0,s.useEffect)(()=>{"lecturer"===w&&i&&g&&y||"student"===w&&O&&g&&y?(v(!0),T()):p([])},[i,O,g,y]);let M=async()=>{try{let e=localStorage.getItem("classrooms");e&&c(JSON.parse(e))}catch(e){console.error("Error loading classrooms:",e)}},R=async()=>{try{let e=localStorage.getItem("students");e&&h(JSON.parse(e))}catch(e){console.error("Error loading students:",e)}},T=async()=>{try{let e=localStorage.getItem("attendance");if(e){let t=JSON.parse(e);if("student"===w){let e=t.filter(e=>e.classroomId===(null==O?void 0:O.id)&&e.subjectId===g&&e.studentId===N&&(!y||e.date===y));e.sort((e,t)=>new Date(t.date).getTime()-new Date(e.date).getTime()),p(e)}else{let e=t.filter(e=>e.classroomId===i&&e.subjectId===g&&e.date===y);p(e)}}else p([])}catch(e){console.error("Error loading attendance:",e),p([])}finally{v(!1)}},_=(e,t)=>{if("lecturer"!==w)return;let r=x.find(t=>t.id===e);if(!r)return;let a=[...C],s=a.findIndex(e=>e.studentId===r.rollNumber&&e.classroomId===i&&e.subjectId===g&&e.date===y);-1!==s?a[s].present=t:a.push({id:Date.now().toString()+r.rollNumber,studentId:r.rollNumber,classroomId:i,subjectId:g,date:y,present:t}),E(a)};return((0,s.useEffect)(()=>{localStorage.getItem("attendance")||localStorage.setItem("attendance","[]")},[]),(0,s.useEffect)(()=>{p([]),E([]),"lecturer"===w?i&&g&&y&&(v(!0),T()):"student"===w&&O&&g&&(v(!0),T())},[i,O,g,y]),j)?(0,a.jsx)("div",{className:"min-h-screen flex items-center justify-center",children:(0,a.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"})}):(0,a.jsx)("div",{className:"min-h-screen bg-gray-100 dark:bg-gray-900",children:(0,a.jsxs)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:[(0,a.jsxs)("div",{className:"flex justify-between items-center mb-8",children:[(0,a.jsxs)("div",{className:"flex items-center space-x-4",children:[(0,a.jsx)(l.Z,{}),(0,a.jsx)("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Attendance"})]}),(0,a.jsx)("button",{onClick:()=>{let e=!r;d(e),localStorage.setItem("darkMode",String(e)),document.documentElement.classList.toggle("dark",e)},className:"p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200","aria-label":"Toggle dark mode",children:r?(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"})}):(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"})})})]}),"lecturer"===w?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("div",{className:"bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6",children:(0,a.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Classroom"}),(0,a.jsxs)("select",{value:i,onChange:e=>{u(e.target.value),m("")},className:"w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white",children:[(0,a.jsx)("option",{value:"",children:"Select Classroom"}),o.map(e=>(0,a.jsx)("option",{value:e.id,children:e.name},e.id))]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Subject"}),(0,a.jsxs)("select",{value:g,onChange:e=>m(e.target.value),className:"w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white",disabled:!i,children:[(0,a.jsx)("option",{value:"",children:"Select Subject"}),i&&(null===(e=o.find(e=>e.id===i))||void 0===e?void 0:e.subjects.map(e=>(0,a.jsxs)("option",{value:e.id,children:[e.name," (",e.code,")"]},e.id)))]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Date"}),(0,a.jsx)("input",{type:"date",value:y,onChange:e=>f(e.target.value),className:"w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"})]})]})}),(0,a.jsx)("div",{className:"flex justify-end mb-4",children:(0,a.jsxs)("button",{onClick:()=>{if(window.confirm("Are you sure you want to clear all attendance records? This action cannot be undone."))try{localStorage.setItem("attendance","[]"),p([]),E([]),L("All attendance records cleared successfully!"),setTimeout(()=>L(""),3e3)}catch(e){console.error("Error clearing attendance:",e),L("Error clearing attendance records. Please try again.")}},className:"px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 flex items-center space-x-2",children:[(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})}),(0,a.jsx)("span",{children:"Clear All Attendance Records"})]})}),i&&g&&(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("div",{className:"bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-4",children:(0,a.jsx)("div",{className:"overflow-x-auto",children:(0,a.jsxs)("table",{className:"min-w-full divide-y divide-gray-200 dark:divide-gray-700",children:[(0,a.jsx)("thead",{className:"bg-gray-50 dark:bg-gray-700",children:(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",children:"Roll Number"}),(0,a.jsx)("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",children:"Name"}),(0,a.jsx)("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",children:"Status"})]})}),(0,a.jsx)("tbody",{className:"bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700",children:x.filter(e=>e.classId===i).map(e=>{let t=C.find(t=>t.studentId===e.rollNumber)||b.find(t=>t.studentId===e.rollNumber);return(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white",children:e.rollNumber}),(0,a.jsx)("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white",children:e.name}),(0,a.jsx)("td",{className:"px-6 py-4 whitespace-nowrap text-sm",children:(0,a.jsx)("button",{onClick:()=>_(e.id,!(null==t?void 0:t.present)),className:"px-3 py-1 rounded-full text-xs font-medium ".concat((null==t?void 0:t.present)?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"),children:(null==t?void 0:t.present)?"Present":"Absent"})})]},e.id)})})]})})}),(0,a.jsxs)("div",{className:"flex items-center justify-between mb-6",children:[(0,a.jsx)("button",{onClick:()=>{A(!0),L("");try{let e=localStorage.getItem("attendance")||"[]",t=JSON.parse(e);t=t.filter(e=>!(e.classroomId===i&&e.subjectId===g&&e.date===y));let r=x.filter(e=>e.classId===i).map(e=>{let t=C.find(t=>t.studentId===e.rollNumber);return{id:Date.now().toString()+e.rollNumber,studentId:e.rollNumber,classroomId:i,subjectId:g,date:y,present:!!t&&t.present}});t=[...t,...r],localStorage.setItem("attendance",JSON.stringify(t)),p(r),E([]),L("Attendance saved successfully!")}catch(e){console.error("Error saving attendance:",e),L("Error saving attendance. Please try again.")}finally{A(!1),setTimeout(()=>L(""),3e3)}},disabled:P||0===C.length,className:"px-4 py-2 rounded-lg text-white flex items-center space-x-2 ".concat(P||0===C.length?"bg-gray-400 cursor-not-allowed":"bg-green-600 hover:bg-green-700"),children:P?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("svg",{className:"animate-spin h-5 w-5 mr-2",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[(0,a.jsx)("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),(0,a.jsx)("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),(0,a.jsx)("span",{children:"Saving..."})]}):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("svg",{className:"h-5 w-5",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})}),(0,a.jsx)("span",{children:"Save Attendance"})]})}),D&&(0,a.jsx)("div",{className:"px-4 py-2 rounded-lg ".concat(D.includes("Error")?"bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300":"bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"),children:D})]})]})]}):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("div",{className:"bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6",children:(0,a.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[O&&(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Class"}),(0,a.jsx)("div",{className:"w-full rounded-md border border-gray-300 shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5",children:O.name})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Subject"}),(0,a.jsxs)("select",{value:g,onChange:e=>m(e.target.value),className:"w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5",children:[(0,a.jsx)("option",{value:"",children:"Select Subject"}),null==O?void 0:O.subjects.map(e=>(0,a.jsxs)("option",{value:e.id,children:[e.name," (",e.code,")"]},e.id))]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Date"}),(0,a.jsx)("input",{type:"date",value:y,onChange:e=>f(e.target.value),className:"w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5"})]})]})}),g&&(0,a.jsx)("div",{className:"bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden",children:(0,a.jsx)("div",{className:"overflow-x-auto",children:(0,a.jsxs)("table",{className:"min-w-full divide-y divide-gray-200 dark:divide-gray-700",children:[(0,a.jsx)("thead",{className:"bg-gray-50 dark:bg-gray-700",children:(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",children:"Date"}),(0,a.jsx)("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",children:"Status"})]})}),(0,a.jsx)("tbody",{className:"bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700",children:b.length>0?b.map(e=>(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white",children:e.date}),(0,a.jsx)("td",{className:"px-6 py-4 whitespace-nowrap text-sm",children:(0,a.jsx)("span",{className:"px-3 py-1 rounded-full text-xs font-medium ".concat(e.present?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"),children:e.present?"Present":"Absent"})})]},e.id)):(0,a.jsx)("tr",{children:(0,a.jsx)("td",{colSpan:2,className:"px-6 py-4 text-center text-gray-500 dark:text-gray-400",children:"No attendance records found"})})})]})})})]})]})})}},580:function(e,t,r){"use strict";r.d(t,{Z:function(){return l}});var a=r(3827),s=r(7907),n=r(1399);function l(e){let{onClick:t}=e,r=(0,s.useRouter)();return(0,a.jsxs)("button",{onClick:()=>{t?t():r.back()},className:"mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors",children:[(0,a.jsx)(n.x_l,{}),(0,a.jsx)("span",{children:"Back"})]})}},7907:function(e,t,r){"use strict";var a=r(5313);r.o(a,"usePathname")&&r.d(t,{usePathname:function(){return a.usePathname}}),r.o(a,"useRouter")&&r.d(t,{useRouter:function(){return a.useRouter}}),r.o(a,"useSearchParams")&&r.d(t,{useSearchParams:function(){return a.useSearchParams}})},158:function(e,t,r){"use strict";r.d(t,{w_:function(){return i}});var a=r(4090),s={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},n=a.createContext&&a.createContext(s),l=["attr","size","title"];function d(){return(d=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e}).apply(this,arguments)}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,a)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach(function(t){var a,s;a=t,s=r[t],(a=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var a=r.call(e,t||"default");if("object"!=typeof a)return a;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(a))in e?Object.defineProperty(e,a,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[a]=s}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function i(e){return t=>a.createElement(u,d({attr:c({},e.attr)},t),function e(t){return t&&t.map((t,r)=>a.createElement(t.tag,c({key:r},t.attr),e(t.child)))}(e.child))}function u(e){var t=t=>{var r,{attr:s,size:n,title:o}=e,i=function(e,t){if(null==e)return{};var r,a,s=function(e,t){if(null==e)return{};var r={};for(var a in e)if(Object.prototype.hasOwnProperty.call(e,a)){if(t.indexOf(a)>=0)continue;r[a]=e[a]}return r}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(a=0;a<n.length;a++)r=n[a],!(t.indexOf(r)>=0)&&Object.prototype.propertyIsEnumerable.call(e,r)&&(s[r]=e[r])}return s}(e,l),u=n||t.size||"1em";return t.className&&(r=t.className),e.className&&(r=(r?r+" ":"")+e.className),a.createElement("svg",d({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},t.attr,s,i,{className:r,style:c(c({color:e.color||t.color},t.style),e.style),height:u,width:u,xmlns:"http://www.w3.org/2000/svg"}),o&&a.createElement("title",null,o),e.children)};return void 0!==n?a.createElement(n.Consumer,null,e=>t(e)):t(s)}}},function(e){e.O(0,[699,971,69,744],function(){return e(e.s=1351)}),_N_E=e.O()}]);