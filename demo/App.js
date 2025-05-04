export default {
  template: `
    <div class="demo-app">
      <header>
        <h1>VueHeadingsMap Demo</h1>
        <p>This is a demo page with various heading levels to test the VueHeadingsMap extension</p>
      </header>
      
      <main>
        <section class="intro">
          <h2>Introduction</h2>
          <p>VueHeadingsMap helps developers visualize heading structure in Vue projects.</p>
          
          <div class="features">
            <h3>Key Features</h3>
            <ul>
              <li>Tree view of headings</li>
              <li>Warning for improper heading levels</li>
              <li>Easy navigation</li>
            </ul>
          </div>
        </section>
        
        <section class="good-example">
          <h2>Proper Heading Structure</h2>
          <p>This section demonstrates proper heading structure with correct hierarchy.</p>
          
          <h3>Main Points</h3>
          <p>Headings should follow a proper hierarchy without skipping levels.</p>
          
          <h4>Details</h4>
          <p>Each subheading should be one level deeper than its parent.</p>
          
          <h4>More Details</h4>
          <p>Multiple headings at the same level are perfectly fine.</p>
          
          <h3>Another Topic</h3>
          <p>We can go back up the hierarchy correctly.</p>
        </section>
        
        <section class="bad-example">
          <h2>Improper Heading Structure</h2>
          <p>This section demonstrates improper heading structure with incorrect hierarchy.</p>
          
          <h4>Skipped Level</h4>
          <p>This heading skips h3 level, which is considered bad practice.</p>
          
          <h6>Double Skip</h6>
          <p>This heading skips multiple levels, which is even worse for accessibility.</p>
          
          <h3>Back to Proper Level</h3>
          <p>This is actually a proper level after the previous improper ones.</p>
        </section>
      </main>
      
      <footer>
        <h2>Extension Documentation</h2>
        <p>For more details on how to use the extension, check the README file.</p>
      </footer>
    </div>
  `,
  data() {
    return {
      message: 'VueHeadingsMap Demo'
    };
  }
};
