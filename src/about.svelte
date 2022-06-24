<title>Leila Khaertdinova: About me</title>

<link href="https://fonts.googleapis.com/css2?family=Tiro+Tamil:ital@1&display=swap" rel="stylesheet">

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
    <div class="container_about">
        <div class="me">
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src="https://cdn.icon-icons.com/icons2/2630/PNG/512/diversity_avatar_girl_woman_black_hair_people_icon_159085.png">
        </div>
        <div class="personal_info">
            <p>I am bachelor at Innopolis Univesity. I am 18 years old. I was born in Kazan, Tatarstan.</p>
            <p>Some interesting facts about me:</p>
            <ul>
                <li>I am big fan of Netflix series and Haribo gummies</li>
                <li>I speak Tatar language</li>
                <li>Recently I cooked borcht myself</li>
                <li>I like dogs, they are cute</li>
            </ul>
            <p>P.S. Click on DOGS</p>
        </div>
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

.container_about {
    padding: 15px;
    display: grid;
    grid-template-areas: 'result info';
    grid-gap: 10px;
    grid-template-columns: 1fr 2fr;
    justify-content: center;
}

.personal_info {
    grid-area: info;
    padding: 15px;
    color: azure;
    border: 2px solid azure;
    font-size: 20px;
    font-weight: 200;
    font-family: Georgia, 'Times New Roman', Times, serif;
   
}
.me img {
    
    grid-area: result;
    object-fit: cover; 
    height: 100%;
    width: 100%; 
}

</style>
