let size=10,url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${size}&page=1&sparkline=false`;
let table = document.getElementsByClassName("data-table")[0];
let searchInput = document.getElementById("search");
let sortByMktCap = document.getElementById("sortByMktCap");
let sortByPerc = document.getElementById("sortByPerc");
let cryptoData=[];

function createTdElement(obj){
let {name,id ,image:imageSrc, symbol,current_price, total_volume,price_change_percentage_24h,market_cap} = obj;
let tr = document.createElement('tr');
tr.classList.add("row");
let td1,td2,td3,td4,td5,td6;
td1=document.createElement("td");
td1.classList.add('flex');
let img = document.createElement("img");
img.classList.add("crypto-image")
img.src=imageSrc;
td1.appendChild(img);
let span =document.createElement("span");
span.innerText=name;
td1.appendChild(span);
td2=document.createElement("td");
symbol=symbol.toUpperCase();
td2.innerText=symbol;
td3=document.createElement("td");
td3.innerText ="$" +`${current_price}`;
td4=document.createElement("td");
td4.innerText="$" +`${total_volume}`;
td5=document.createElement("td");
let sign="";
if(price_change_percentage_24h>=0){
  sign+="+"; 
  td5.classList.add("positive");
}else{
  td5.classList.add("negative");   
}
price_change_percentage_24h = price_change_percentage_24h.toFixed(2);
td5.innerText=sign+`${price_change_percentage_24h}`;
td6=document.createElement("td");
td6.innerText = `Mkt Cap: $${market_cap}`;


tr.appendChild(td1);
tr.appendChild(td2);
tr.appendChild(td3);
tr.appendChild(td4);
tr.appendChild(td5);
tr.appendChild(td6);

return tr;
}

function createTableDataElements(json){
    let HtmlElementData=[];
    let objs = json.map((element)=>{
        let {name,id ,image:imageSrc, symbol,current_price, total_volume,price_change_percentage_24h,market_cap} = element;
        let obj = {name,id ,image:imageSrc, symbol,current_price, total_volume,price_change_percentage_24h,market_cap};
        cryptoData.push(obj);
        return obj;
    });
    objs.forEach(obj=>{
        HtmlElementData.push(createTdElement(obj));
    });
    return HtmlElementData;
}

// asyn funtion to get json data(crypto) from server
async function getCryptoData(endpoint){
    let response = await fetch(endpoint);
    let data = await response.json();
    return data;
}

getCryptoData(url).then((jsonData)=>{
    let trArray = createTableDataElements(jsonData);
    trArray.forEach(element=>{
       table.appendChild(element);
    })
})

// search implementation
searchInput.addEventListener('keyup',(event)=>{
  let value = event.target.value.toLowerCase();
  console.log(value);
  let searchResults =  cryptoData.filter((obj)=>{
    let name = obj.name.toLowerCase();  
    if(name.startsWith(value)){
        return true;
    }
    return false;
  });
 
  table.innerHTML='';

  searchResults.forEach(searchResult=>{
    let tr = createTdElement(searchResult);
    table.appendChild(tr);
  })
  
});

sortByMktCap.addEventListener('click',()=>{
   table.innerHTML=''; 
   cryptoData.sort((obj1,obj2)=>{
     if(obj1["market_cap"]>obj2["market_cap"]){
        return 1;
     }else if(obj1["market_cap"]<obj2["market_cap"]){
        return -1;
     }
     else 
     return 0;
   })
   cryptoData.forEach((obj)=>{
     let tr = createTdElement(obj);
     table.appendChild(tr);
   })
})

sortByPerc.addEventListener('click',()=>{
    table.innerHTML='';
    let key ="price_change_percentage_24h";
    cryptoData.sort((obj1,obj2)=>{
        if(obj1[key]>obj2[key]){
           return -1;
        }else if(obj1[key]<obj2[key]){
           return 1;
        }
        else 
        return 0;
      })
      console.log(cryptoData);
      cryptoData.forEach((obj)=>{
        let tr = createTdElement(obj);
        table.appendChild(tr);
      })
})

