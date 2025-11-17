#import "AppDelegate.h"
#import "RNBootSplash.h"
#import "SDImageCodersManager.h"
#import <SDWebImageWebPCoder/SDImageWebPCoder.h>
#import <React/RCTLinkingManager.h>
#import <React/RCTBundleURLProvider.h>
#import <RCTAppDependencyProvider.h>

@interface AppDelegate ()
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Configure FastImage WebP support before React Native initialization
  [SDImageCodersManager.sharedManager addCoder:SDImageWebPCoder.sharedCoder];

  self.reactNativeFactory = [[RCTReactNativeFactory alloc] initWithDelegate:self];
  self.dependencyProvider = [RCTAppDependencyProvider new];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];

  [self.reactNativeFactory startReactNativeWithModuleName:@"SuperWallet"
                                                 inWindow:self.window
                                        initialProperties:[self prepareInitialProps]
                                            launchOptions:launchOptions];

  return YES;
}

- (BOOL)application:(UIApplication *)application shouldAllowExtensionPointIdentifier:(NSString *)extensionPointIdentifier
{
  // Block keyboard extensions (custom security requirement)
  if (extensionPointIdentifier == UIApplicationKeyboardExtensionPointIdentifier) {
    return NO;
  }
  return YES;
}

- (NSDictionary *)prepareInitialProps
{
  return @{};
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [RCTBundleURLProvider.sharedSettings jsBundleURLForBundleRoot:@"index"];
#else
  return [NSBundle.mainBundle URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (void)customizeRootView:(RCTRootView *)rootView
{
  [super customizeRootView:rootView];
  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView];
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

@end
