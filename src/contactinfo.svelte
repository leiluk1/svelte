<title>Leila Khaertdinova: Contacts</title>

<link href="https://fonts.googleapis.com/css2?family=Tiro+Tamil:ital@1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

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
            <h1 class="contact">You can contact me via:</h1>
            <br>
            <br>
            <div class="contact-icon">
                <a class="fa fa-vk" href="https://vk.com/leykhaertdinova"> </a>
                <a class="fa fa-telegram" href="https://t.me/leila1kh"> </a>
                <a class="fa fa-instagram" href="https://instagram.com/leiluk1?igshid=YmMyMTA2M2Y="> </a>
        </div>    
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


.contact {
    font-size: 60px;
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-weight: 300;
    text-align: center;
    color: azure;
}
.contact-icon{
    display: flex;   
    justify-content: space-around;
}

.fa {
    justify-content: space-around;
    padding: 27px;
    font-size: 30px;
    width: 86px;
    text-align: center;
    text-decoration: none;
    border-radius: 50%;
  }
  
.fa:hover {
    opacity: 0.7;
}
   
.fa-telegram {
    background: #430297;
    color: white;
}

.fa-vk {
    background: #45bbff;
    color: white;
}

.fa-instagram {
    background: #f40083;
    color: white;
}

</style>
