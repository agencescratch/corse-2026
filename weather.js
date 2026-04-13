const WMO={0:['☀️','Ciel dégagé'],1:['🌤️','Peu nuageux'],2:['⛅','Partiellement nuageux'],3:['☁️','Couvert'],45:['🌫️','Brouillard'],48:['🌫️','Brouillard'],51:['🌦️','Bruine légère'],53:['🌦️','Bruine'],55:['🌧️','Bruine dense'],61:['🌧️','Pluie légère'],63:['🌧️','Pluie modérée'],65:['🌧️','Pluie forte'],80:['🌦️','Averses légères'],81:['🌦️','Averses'],82:['⛈️','Averses fortes'],95:['⛈️','Orageux'],99:['⛈️','Orage grêle']};
const DAYS={'18':'Sam 18 avr','19':'Dim 19 avr','20':'Lun 20 avr','21':'Mar 21 avr'};

async function loadWeather(){
  try{
    const url='https://api.open-meteo.com/v1/forecast?latitude=41.39&longitude=9.16&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode,windspeed_10m_max&timezone=Europe%2FParis&start_date=2026-04-18&end_date=2026-04-21';
    const r=await fetch(url);
    const d=await r.json();
    d.daily.time.forEach((dt,i)=>{
      const day=dt.split('-')[2];
      const el=document.getElementById('wx-'+day);
      if(!el)return;
      const code=d.daily.weathercode[i];
      const[ico,label]=WMO[code]||['🌡️','Variable'];
      const tmax=Math.round(d.daily.temperature_2m_max[i]);
      const tmin=Math.round(d.daily.temperature_2m_min[i]);
      const rain=d.daily.precipitation_probability_max[i];
      const wind=Math.round(d.daily.windspeed_10m_max[i]);
      const rainColor=rain>50?'#9A3415':rain>20?'#8A6210':'#2A6040';
      el.innerHTML=
        '<div class="wx-card"><div class="wx-ico">'+ico+'</div><div>'+
          '<div class="wx-label">'+DAYS[day]+'</div>'+
          '<div class="wx-temp">'+tmin+'° – '+tmax+'°C</div>'+
          '<div class="wx-detail">'+label+'</div>'+
        '</div></div>'+
        '<div class="wx-card"><div class="wx-ico">🌧️</div><div>'+
          '<div class="wx-label">Risque de pluie</div>'+
          '<div class="wx-temp" style="color:'+rainColor+'">'+rain+' %</div>'+
          '<div class="wx-detail">'+(rain<=20?'Peu probable':rain<=50?'Possible':'Probable')+'</div>'+
        '</div></div>'+
        '<div class="wx-card"><div class="wx-ico">💨</div><div>'+
          '<div class="wx-label">Vent max</div>'+
          '<div class="wx-temp">'+wind+' km/h</div>'+
          '<div class="wx-detail">'+(wind<20?'Calme':wind<40?'Modéré':'Venteux')+'</div>'+
        '</div></div>';
    });
  }catch(e){
    ['18','19','20','21'].forEach(function(day){
      const el=document.getElementById('wx-'+day);
      if(el)el.innerHTML='<div class="wx-loading">Météo disponible en ligne</div>';
    });
  }
}
loadWeather();
