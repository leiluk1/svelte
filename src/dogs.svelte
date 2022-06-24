<script lang="ts">

    const dog = document.getElementById('dog') as HTMLDivElement;
    const btn = document.getElementById('btn') as HTMLButtonElement;
    

    
    function getRandomDog() {
        fetch('https://random.dog/woof.json')
            .then(res => res.json())
            .then((data: {url:string})=> { 
                if (data.url.includes('.mp4')) {
                    getRandomDog()
                } else {
                    dog.innerHTML  = `<img src="${data.url}"/>`;} 
                })
    }


</script>

<div class="header">
        <div class="container">
            <div class="header_in">
                <div class="name">Leila Khaertdinova</div>
                <nav class="nav">
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a class="nav_links">Home</a>
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a class="nav_links">About</a>
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a class="nav_links">Dogs</a>
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a class="nav_links">Contact</a>
            </nav>
        </div>
    </div>
</div>
<div class="intro">
    <div class="container_dog">
        <div class="dog_image">
            <div id="dog"></div>
        </div>
        <button class="button" id="btn" on:click={()=>getRandomDog}>Click to see dog</button>     
</div>
</div>

<style>

* {
    box-sizing: border-box;
}

h1, h2, h3, h4, h5, h6 {
    margin: 0;
}

.container {
    margin: 0auto;
    width: 100%;
    max-width: 1200px;
}

.intro {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background: rgb(2,0,36);
    background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(96,40,159,1) 17%, rgba(205,61,223,1) 49%, rgba(0,212,255,1) 100%);
    background-position: center;
    background-size: cover;
}

.header {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

.header_in {
    display: flex;
    justify-content: space-between;
    align-items: center;

}
.name {
    font-size: medium;
    font-weight: 400;
    text-transform: uppercase;
    padding: 30px;
    color: darkviolet;
}
.nav {
    font-size: medium;
    text-transform: uppercase;
}

.nav_links {
    display: inline-block;
    vertical-align: top;
    margin: 15px;
    color: azure;
    text-decoration: none;

}

.nav_links:hover {
    color: blueviolet;
}

.button {
    display: inline-block;
    vertical-align: top;
    margin: 10px;
    padding: 6px 30px;
    border: 2px solid;
    border-color: azure;
    font-size: 15px;
    font-weight: 300;
    color: darkorchid;
    text-transform: uppercase;
    text-decoration: none;
    text-align: center;
}


.button:active {
    transform: scale(0.98);
}

.container_dog {
    display: grid;
    align-items: center;
    justify-content: center;
    grid-auto-flow: row;
    grid-gap: 5px;
}

.dog_image {
    align-items: center;
    justify-content: center;
    margin: 10px;
    height: 400px;
    width: 300px;
    color: azure;
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: 25px;
}

</style>