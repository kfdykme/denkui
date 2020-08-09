/*
 * @Author: kfdykme
 */


 // bbs 的api需要将header设置为application/x-www-form-urlencoded; 所以没定
 
export default {
    fetch: async (o:any)=> {
        console.info('FETCH fetch', o)

        let params = new URLSearchParams(); 

        for (let x in o.data) {
          params.append(x, o.data[x]);
        }
        
        return await fetch(o.url, {
            body: params,
            method: o.method,
            headers: o.header ? o.header : {
                
            }

        }).then(async (res) => {
            o.res = res
            
            console.info("FETCH res", res)

            if (o.success) {
                
                let data = {
                    data:JSON.stringify(await res.json())
                }

                o.success(data)
            }

        }).catch((err) =>{
            console.error('error', err)
        }).finally(() => {
            
            if (o.complete) {
                o.complete()
            }

        })
    }
}