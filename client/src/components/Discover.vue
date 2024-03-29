<template>
  <div class="main">
    <!-- search panel -->
    <div 
      :style="searchStyleMain" 
      class="search"
    >
      <img
        v-if="!searching"
        @click="engageSearch()"
        class="search-icon"
        src="../assets/search.svg"
        alt="search"
      />
      <img
        @click="disengageSearch()"
        :style="showEsc"
        class="esc-icon"
        src="../assets/backsearch.svg"
        alt="esc."
      />

      <input
        v-if="searching"
        v-model="rawQuery"
        @click="engageSearch(rawQuery)"
        ref="searchbar"
        class="searchbar"
        type="text"
        placeholder="Try searching 'Yona Voss-Andreae'"
      />
    </div>

    <!-- display search results -->
    <div v-if="rawQuery.length === 0 && searching">
      <center>
        <p style="margin-top: 12.5vh; font-size: 7pt">
          Filters: '^' for Content, '=' for Headline, '$' for Author, '_' for
          Category
        </p>
        <img
          class="magnifying-glass"
          src="../assets/search.svg"
          alt="magnifying glass"
        />
      </center>
    </div>
    <div v-else-if="rawQuery.length > 0 && searching">
      <p 
        v-if="displayedArticles.length > 0" 
        class="search-text"
      >
        Here's What We Found:
      </p>
      <div v-else style="margin-top: 20vh">
        <center>
          <p style="font-size: 12pt">
            Bad News!
          </p>
          <p style="font-size: 12pt">
            We Can't Find What You're Searching For
          </p>
          <p style="font-size: 40pt">
            😢
          </p>
        </center>
      </div>

      <div
        class="parent"
        v-for="article in displayedArticles"
        :key="article.id"
      >
        <div 
          @click="$parent.articleRequested(article)"
          class="box-1" 
        >
          <img 
            :src="article.image" 
            :alt="article.imageCaption" 
            class="photo" 
          />
          <div class="box-2">
            <p class="author">
              {{ article.date }} - {{ article.author.substring(1) }}
            </p>
            <p class="cat">
              {{ article.category.substring(1) }}
              </p>
            <h2 class="title">
              {{ article.title.substring(1) }}
            </h2>
          </div>
          <div class="box-3">
            <img
              v-if="article.saved"
              @click="$parent.bookmark(article, false)"
              class="book"
              src="../assets/remove-bookmark.svg"
              alt="unsave"
            />
            <img
              v-else
              @click="$parent.bookmark(article, true)"
              class="book"
              src="../assets/add-bookmark.svg"
              alt="save"
            />
          </div>
        </div>
      </div>
      <br /><br /><br />
    </div>

    <!-- article of the day -->
    <div v-if="!searching">
      <center>
        <h1 class="article-of-the-day-title">
          Article of the Day
        </h1>
      </center>
      <div 
        v-if="articleOfTheDay"
        class="parent" 
      >
        <div
          class="box-1"
          @click="$parent.articleRequested(articleOfTheDay)"
        >
          <img
            class="photo"
            :src="articleOfTheDay.image"
            :alt="articleOfTheDay.imageCaption"
          />
          <div class="box-2">
            <p class="author">
              {{ articleOfTheDay.date }} -
              {{ articleOfTheDay.author.substring(1) }}
            </p>
            <p class="cat">
              {{ articleOfTheDay.category.substring(1) }}
            </p>
            <h2 class="title">
              {{ articleOfTheDay.title.substring(1) }}
            </h2>
          </div>
          <div class="box-3">
            <img
              v-if="articleOfTheDay.saved"
              @click="$parent.bookmark(articleOfTheDay, false)"
              class="book"
              src="../assets/remove-bookmark.svg"
              alt="unsave"
            />
            <img
              v-else
              @click="$parent.bookmark(articleOfTheDay, true)"
              class="book"
              src="../assets/add-bookmark.svg"
              alt="save"
            />
          </div>
        </div>
      </div>
      <div class="center" v-else>
        We Couldn't Find an Article of the Day
      </div>
    </div>

    <!-- category tags -->
    <center>
      <div v-if="!searching">
        <!-- underscore character ensures strictly category search -->
        <h3 class="cat-title">
          Quick Filters
        </h3>
        <div 
          v-for="category in categories"
          :key="category"
        >
          <h2 
            class="quick-search" 
            @click="engageSearch('_' + category)"
          >
            {{ category }}
          </h2>
        </div>
      </div>
    </center>

    <div v-if="!searching">
      <h3 class="social-title">Connect With Us</h3>
      <div class="socials">
        <div class="social-icons">
          <a href="https://www.instagram.com/penmenpress/" target="_blank">
            <img src="../assets/instagram.svg" alt="instagram" />
          </a>
        </div>
        <div class="social-icons">
          <a href="https://www.facebook.com/penmenpress/" target="_blank">
            <img src="../assets/facebook.svg" alt="facebook" />
          </a>
        </div>
        <div class="social-icons">
          <a href="https://penmenpress.com/" target="_blank">
            <img src="../assets/website.svg" alt="website" />
          </a>
        </div>
      </div>
    </div>

    <br /><br /><br /><br />
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      articleOfTheDay: null,
      searching: false,
      displayedArticles: [],
      rawQuery: "",
      searchStyleMain: "padding-top: 1vh;",
      showEsc: "display: none;",
      categories: [
        "News",
        "Arts & Entertainment",
        "Lifestyle",
        "Opinion",
        "Sports",
        "April Fools"
      ]
    };
  },
  props: ["articles"],
  watch: {
    rawQuery() {
      this.search();
    },
  },
  methods: {
    // sanitizes user provided search query
    sanitizeQuery(raw) {
      // let output = raw.replace(/\s/g, '');
      raw = raw.toLowerCase();
      return raw;
    },
    search() {
      let query = this.rawQuery;
      let searchShortHands = ["$", "_", "=", "^"];
      let corrospondingTerms = [
        "Author: ",
        "Category: ",
        "Headline: ",
        "Content: ",
      ];

      for (let i = 0; i < searchShortHands.length; i++) {
        if (this.rawQuery[0] === searchShortHands[i]) {
          this.rawQuery = corrospondingTerms[i] + this.rawQuery.substring(1);
          break;
        }
      }
      for (let i = 0; i < corrospondingTerms.length; i++) {
        if (
          corrospondingTerms[i] ===
          this.rawQuery.substring(0, corrospondingTerms[i].length)
        ) {
          this.executeSearch(
            this.sanitizeQuery(
              searchShortHands[i] +
                query.substring(corrospondingTerms[i].length)
            ),
            searchShortHands[i]
          );
          return;
        }
      }

      this.executeSearch(this.sanitizeQuery(query, false));
    },
    executeSearch(query, filterChar) {
      this.displayedArticles = [];
      if (!query) return;

      if (filterChar) {
        let target = query[0];
        query = query.substring(1);
        switch (target) {
          case "_":
            this.displayedArticles = this.articles.filter((item) =>
              item.category.toLowerCase().includes(query)
            );
            break;
          case "$":
            this.displayedArticles = this.articles.filter((item) =>
              item.author.toLowerCase().includes(query)
            );
            break;
          case "=":
            this.displayedArticles = this.articles.filter((item) =>
              item.title.toLowerCase().includes(query)
            );
            break;
          case "^":
            this.displayedArticles = this.articles.filter((item) =>
              item.content.toLowerCase().includes(query)
            );
            break;
        }
        return;
      }

      for (let i = 0; i < this.articles.length; i++) {
        switch (true) {
          case this.articles[i].title.toLowerCase().includes(query):
            this.displayedArticles.push(this.articles[i]);
            break;
          case this.articles[i].author.toLowerCase().includes(query):
            this.displayedArticles.push(this.articles[i]);
            break;
          case this.articles[i].category.toLowerCase().includes(query):
            this.displayedArticles.push(this.articles[i]);
            break;
          case this.articles[i].content.toLowerCase().includes(query):
            this.displayedArticles.push(this.articles[i]);
            break;
        }
      }
    },
    engageSearch(searchQuery = '') {
      setTimeout((() => this.$refs.searchbar.focus()), 500);

      window.scrollTo(0, 0);
      this.showEsc = "";
      this.searching = true;
      this.rawQuery = searchQuery;
      this.searchStyleMain =
        "padding-top: 3vh; border-bottom: 1px solid black; background: #c9c9c9f5; box-shadow: rgb(25, 25, 25) 0px 0px 10px;";
    },
    disengageSearch() {
      this.showEsc = "display: none;";
      this.searching = false;
      this.rawQuery = "";
      this.searchStyleMain = "padding-top: 1vh;";
    },
  },
  mounted() {
    if (!this.articles.length) return
    this.articleOfTheDay = this.articles[Math.floor(Math.random() * this.articles.length)];
  },
};
</script>

<style scoped>
/* SOCIALS */
.social-title {
  font-size: 16pt;
  text-align: center;
}
.socials {
  display: flex;
  justify-content: center;
}
.social-icons {
  width: 10vw;
  margin: 3%;
  margin-top: 0%;
}

/* ARTICLE OF THE DAY */
.article-of-the-day-title {
  font-size: 16pt;
  margin-top: 12.5vh;
}

/* QUICK SEARCH STYLING */
.cat-title {
  font-size: 16pt;
}
.quick-search {
  box-shadow: rgb(180, 180, 180) 3px 3px 5px;
  border: rgb(0, 0, 0) solid 0.5px;
  font-size: 13pt;
  color: white;
  border-radius: 25px;
  padding: 1.5vh;
  width: 80%;
  font-weight: normal;
  background-color: rgb(46, 185, 185);
}

/* SEARCH RESULT DECORATIVES*/
.magnifying-glass {
  padding: 2vh;
  margin-top: 5vh;
  width: 15vh;
  filter: invert(100%);
  border-radius: 25%;
}
.search-text {
  font-size: 12pt;
  color: black;
  margin-top: 12.5vh;
  margin-left: 3%;
}

/* SEARCH HEADER DISPLAY */
.esc-icon {
  height: 3.5vh;
  opacity: 1;
  filter: invert(60%);
  margin-top: 2.3%;
}
.search {
  display: flex;
  position: fixed;
  top: 0;
  width: 100vw;
  background: linear-gradient(#525252, #ffffff00);
  padding-top: 1vh;
  padding-bottom: 2vh;
  padding-left: 5vw;
  transition: 100ms ease-in-out;
}
.searchbar {
  border: 1px solid black;
  border-radius: 40px;
  font-size: 2vh;
  height: 5vh;
  margin-left: 3%;
  width: 77%;
  padding-left: 3%;
}
.search-icon {
  filter: invert(100%);
  padding-top: 2vh;
  height: 4vh;
}
input {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
</style>
