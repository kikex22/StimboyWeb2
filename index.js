// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getDatabase, ref, onValue,set } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB_HEU7dpE2yj1x8SwoSnoKxNZXkuwYRzg",
  authDomain: "stimboy-1ca74.firebaseapp.com",
  projectId: "stimboy-1ca74",
  databaseURL: "https://stimboy-1ca74-default-rtdb.firebaseio.com",
  storageBucket: "stimboy-1ca74.firebasestorage.app",
  messagingSenderId: "417573823836",
  appId: "1:417573823836:web:4ec9fc13e99305267c8d99",
  measurementId: "G-CR431YXJN6"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
console.log("✅ Firebase inicializado");

// Inicializar Auth
const auth = getAuth();


// Vue.js Application
const appVue = Vue.createApp({
  data() {
    return {
      user: null,
      loginText: "Iniciar Sesión",
      loginLink: "login.html",
      logoutVisible: false,
      firebaseData: {}, // ✅ Inicializar vacío para evitar errores
      dataLoaded: false,
      isVisible: [],
      isVisibleAcerca: [],
      isVisibleStimboy: [],
      acercaDeItems: [
        { imagen: "gocho.JPEG", texto: "Pruebas del correcto funcionamiento del dispositivo ", alt: "Gocho" },
        { imagen: "senales.jpg", texto: "Grafico de señales en el simulador y en el circuito real", alt: "Señales" },
        { imagen: "mpu.JPEG", texto: "Monitoreo de la rodilla", alt: "MPU" },
        { imagen: "ems.jpg", texto: "Hardware del sistema Ems/Tens", alt: "EMS" },
        { imagen: "wilker.png", texto: "Se desarrollaron pruebas con distintos sujetos", alt: "Wilker" }
      ],
      servicios: [
        { nombre: "Evaluación Inicial", descripcion: "Sesión de diagnóstico inicial con análisis personalizado y configuración del dispositivo.", precio: "$50 USD" },
        { nombre: "Terapia Básica", descripcion: "Programa estándar de electroestimulación y monitoreo de rodilla.", precio: "$200 USD por mes" },
        { nombre: "Terapia Avanzada", descripcion: "Incluye personalización completa, análisis de datos y soporte prioritario.", precio: "$350 USD por mes" },
        { nombre: "Plan Profesional", descripcion: "Acceso a dispositivos múltiples con soporte técnico avanzado.", precio: "$800 USD por mes" },
        { nombre: "Alquiler de Dispositivo", descripcion: "Alquiler mensual del sistema completo de StimBoy para uso personal o profesional.", precio: "$150 USD por mes" }
      ],
      stimboy:[
        {Nombre:"StimBoy Portal", descripcion:"El Stimboy Portal es una plataforma web que permite a los usuarios acceder a sus datos de salud y monitoreo de la rodilla de manera segura y conveniente. A través del portal, los usuarios pueden visualizar sus registros de terapia, realizar un seguimiento de su progreso y recibir recomendaciones personalizadas para optimizar su tratamiento."},
        {Nombre:"StimBoy Portal", descripcion:" Realizado por el equipo de desarrollo de StimBoy, el portal está diseñado para ser fácil de usar y accesible desde cualquier dispositivo con conexión a Internet. Los usuarios pueden iniciar sesión en su cuenta personal y acceder a sus datos en cualquier momento y lugar"},
        {Nombre:"StimBoy Portal", descripcion:"El portal también ofrece la posibilidad de compartir datos con profesionales de la salud, lo que facilita la colaboración y el seguimiento del progreso del paciente. Con el Stimboy Portal, los usuarios tienen el control total de su salud y bienestar, y pueden aprovechar al máximo los beneficios de la terapia de electroestimulación."},
      ],
      Service: false,
      StimboyWeb: false,
      Acercade: false,
    };
  },

  mounted() {
    this.isVisible = new Array(this.servicios.length).fill(false);
    this.isVisibleAcerca = new Array(this.acercaDeItems.length).fill(false);
    this.isVisibleStimboy = new Array(this.stimboy.length).fill(false);

    
    // Detectar cambios en el estado de autenticación
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.loginText = `Hola, ${user.displayName || user.email.split("@")[0]}`;
        this.loginLink = "#";
        this.logoutVisible = true;
      } else {
        this.user = null;
        this.loginText = "Iniciar Sesión";
        this.loginLink = "login.html";
        this.logoutVisible = false;
      }
    });

    window.addEventListener("scroll", this.handleScroll);

   // Leer datos de Firebase
   const dataRef = ref(database, "test");
   onValue(dataRef, (snapshot) => {
    if (snapshot.exists()) {
      console.log("📌 Datos recibidos de Firebase:", snapshot.val());
      this.firebaseData = { ...snapshot.val() };
      this.dataLoaded = true;
    } else {
      console.log("⚠️ No hay datos en Firebase.");
      this.firebaseData = {}; 
      this.dataLoaded = false;
    }
  }, (error) => {
    console.error("❌ Error al leer datos de Firebase:", error);
    this.dataLoaded = false;
  });
  },  


  methods: {
    handleScroll() {
      if (this.$refs.Service) {
        const tituloTop = this.$refs.Service.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (tituloTop < windowHeight - 200) {
          this.Service = true;
        }
      }

      if (this.$refs.StimboyWeb) {
        const tituloTop = this.$refs.Service.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (tituloTop < windowHeight - 200) {
          this.StimboyWeb = true;
        }
      }


      if (this.$refs.Acercade) {
        const tituloTop = this.$refs.Acercade.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (tituloTop < windowHeight - 300) {
          this.Acercade = true;
        }
      }

      this.$refs.fadeSections?.forEach((section, index) => {
        const elementTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 300) {
          this.isVisible[index] = true;
        }
      });

      this.$refs.fadeStimboyWeb?.forEach((section, index) => {
        const elementTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 300) {
          this.isVisibleStimboy[index] = true;
        }
      });

      this.$refs.fadeAcerca?.forEach((section, index) => {
        const elementTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 300) {
          this.isVisibleAcerca[index] = true;
        }
      });
    },

    logout() {
      signOut(auth)
        .then(() => {
          console.log("✅ Sesión cerrada");
          this.user = null;
          this.loginText = "Iniciar Sesión";
          this.loginLink = "login.html";
          this.logoutVisible = false;
        })
        .catch((error) => {
          console.error("❌ Error al cerrar sesión:", error);
        });
    },
    // Toda la info del EPS32 TENS Y EMS
    EmsOn() {
      const emsConfig = {
        status: "on",  // Activar EMS
        freq: 1,       // Frecuencia en Hz (ejemplo)
        ton: 500       // Duración del pulso en milisegundos (ejemplo)
      };
    
      // Establecer el valor en Firebase
      set(ref(database, "ems"), emsConfig)
        .then(() => {
          console.log("✅ EMS activado en Firebase");
          // Mostrar una alerta cuando el EMS se activa
          alert("EMS activado correctamente.");
        })
        .catch((error) => {
          console.error("❌ Error al activar EMS en Firebase:", error);
        });
    },
    EmsOn2() {
      const emsConfig = {
        status: "on",  // Activar EMS
        freq: 3.33,       // Frecuencia en Hz (ejemplo)
        ton: 150       // Duración del pulso en milisegundos (ejemplo)
      };
    
      // Establecer el valor en Firebase
      set(ref(database, "ems"), emsConfig)
        .then(() => {
          console.log("✅ EMS activado en Firebase");
          // Mostrar una alerta cuando el EMS se activa
          alert("EMS activado correctamente.");
        })
        .catch((error) => {
          console.error("❌ Error al activar EMS en Firebase:", error);
        });
    },
    EmsOn3() {
      const emsConfig = {
        status: "on",  // Activar EMS
        freq: 5,       // Frecuencia en Hz (ejemplo)
        ton: 100       // Duración del pulso en milisegundos (ejemplo)
      };
      set(ref(database, "ems"), emsConfig)
        .then(() => {
          console.log("✅ EMS activado en Firebase");
          alert("EMS activado correctamente.");
        })
        .catch((error) => {
          console.error("❌ Error al activar EMS en Firebase:", error);
        });
    },
    EmsOn4() {
      const emsConfig = {
        status: "on",  // Activar EMS
        freq: 10,       // Frecuencia en Hz (ejemplo)
        ton: 50       // Duración del pulso en milisegundos (ejemplo)
      };
      set(ref(database, "ems"), emsConfig)
        .then(() => {
          console.log("✅ EMS activado en Firebase");
          alert("EMS activado correctamente.");
        })
        .catch((error) => {
          console.error("❌ Error al activar EMS en Firebase:", error);
        });
    },
    EmsOn5() {
      const emsConfig = {
        status: "on",  // Activar EMS
        freq: 20,       // Frecuencia en Hz (ejemplo)
        ton: 10      // Duración del pulso en milisegundos (ejemplo)
      };
      set(ref(database, "ems"), emsConfig)
        
    },

    EmsOff() {
      const emsConfig = {
        status: "off",  // Desactivar EMS
        freq: 1,        // Frecuencia en Hz (ejemplo)
        ton: 500          // Duración del pulso en milisegundos (ejemplo)
      };
    
      // Establecer el valor en Firebase
      set(ref(database, "ems"), emsConfig)
        .then(() => {
          console.log("✅ EMS desactivado en Firebase");
          // Mostrar una alerta cuando el EMS se desactiva
          alert("EMS desactivado correctamente.");
        })
        .catch((error) => {
          console.error("❌ Error al desactivar EMS en Firebase:", error);
        });
    },
    TensOn() {
    const TensConfig={
      status:"on",
      freq:30,
      ton:8
    }
    set(ref(database,"tens"),TensConfig)
    },
    TensOff(){
      const TensConfig={
        status:"off",
        freq:40,
        ton:6
      }
      set(ref(database,"tens"),TensConfig)
    },
    TensOn2(){
      const TensConfig={
        status:"on",
        freq:40,
        ton:6
      }
      set(ref(database,"tens"),TensConfig)
    },
    TensOn3(){
      const TensConfig={
        status:"on",
        freq:50,
        ton:5   //80 y 3 100 y 2
      }
      set(ref(database,"tens"),TensConfig)
    },
    TensOn4(){
      const TensConfig={
        status:"on",
        freq:80,
        ton:3
      }
      set(ref(database,"tens"),TensConfig)
    }





  }


});


// Montar la aplicación Vue en el div con id "app"
appVue.mount("#app");
