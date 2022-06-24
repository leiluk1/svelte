<title>Leila Khaertdinova: Homepage</title>

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
    <div class="container">
        <div class="intro_in">
            <h1 class="hello">Hello everyone, I'm Leila</h1>
            <h2 class="welcome">Welcome to my website!</h2>
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

.intro_in {
    width: 100%;
    max-width: 880px;
    margin: 0 auto;
    color: azure;
    text-align: center;
}

.hello {
    font-size: 90px;
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-weight: 600;
    text-align: center;
    line-height: 1.1;

}

.welcome {
    font-size: 45px;
    font-weight: 300;
    text-align: center;
    color: azure;
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
    color: azure;
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

</style>