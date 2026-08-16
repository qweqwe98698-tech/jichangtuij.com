import type { Theme } from 'vitepress'

import './styles/variables.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/content.css'
import './styles/animations.css'
import './styles/responsive.css'
import './styles/print.css'

import Layout from './Layout.vue'
import NotFoundPage from './components/NotFoundPage.vue'

// 可在 Markdown 中直接使用的全局组件
import AnswerBox from './components/AnswerBox.vue'
import KeyFacts from './components/KeyFacts.vue'
import DecisionTable from './components/DecisionTable.vue'
import WarningBox from './components/WarningBox.vue'
import FaqSection from './components/FaqSection.vue'
import ArticleGrid from './components/ArticleGrid.vue'
import CategoryCard from './components/CategoryCard.vue'
import TopicCard from './components/TopicCard.vue'
import ArticleCard from './components/ArticleCard.vue'
import GlossaryList from './components/GlossaryList.vue'
import NewsletterCard from './components/NewsletterCard.vue'
import SearchPanel from './components/SearchPanel.vue'
import ProviderStatus from './components/ProviderStatus.vue'
import ContentProgress from './components/ContentProgress.vue'
import JcFigure from './components/JcFigure.vue'
import TopicIndex from './components/TopicIndex.vue'
import TagIndex from './components/TagIndex.vue'
import TaggedArticles from './components/TaggedArticles.vue'
import JcIcon from './components/JcIcon.vue'
import SponsoredLink from './components/SponsoredLink.vue'
import ProviderMeasurementCard from './components/ProviderMeasurementCard.vue'
import ProviderDirectory from './components/ProviderDirectory.vue'
import QuickFinder from './components/QuickFinder.vue'
import NextStepMatrix from './components/NextStepMatrix.vue'

const theme: Theme = {
  Layout,
  NotFound: NotFoundPage,
  enhanceApp({ app }) {
    app.component('AnswerBox', AnswerBox)
    app.component('KeyFacts', KeyFacts)
    app.component('DecisionTable', DecisionTable)
    app.component('WarningBox', WarningBox)
    app.component('FaqSection', FaqSection)
    app.component('ArticleGrid', ArticleGrid)
    app.component('CategoryCard', CategoryCard)
    app.component('TopicCard', TopicCard)
    app.component('ArticleCard', ArticleCard)
    app.component('GlossaryList', GlossaryList)
    app.component('NewsletterCard', NewsletterCard)
    app.component('SearchPanel', SearchPanel)
    app.component('ProviderStatus', ProviderStatus)
    app.component('ContentProgress', ContentProgress)
    app.component('JcFigure', JcFigure)
    app.component('TopicIndex', TopicIndex)
    app.component('TagIndex', TagIndex)
    app.component('TaggedArticles', TaggedArticles)
    app.component('JcIcon', JcIcon)
    app.component('SponsoredLink', SponsoredLink)
    app.component('ProviderMeasurementCard', ProviderMeasurementCard)
    app.component('ProviderDirectory', ProviderDirectory)
    app.component('QuickFinder', QuickFinder)
    app.component('NextStepMatrix', NextStepMatrix)
  }
}

export default theme
