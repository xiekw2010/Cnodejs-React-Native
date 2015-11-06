//
//  JHSMagicLampPullToRefreshView.h
//  JU
//
//  Created by lamo on 14/12/23.
//  Copyright (c) 2014年 ju.taobao.com. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "JHSPullToRefreshProtocols.h"

@interface JHSMagicLampPullToRefreshView : UIView<JHSPullToRefreshViewObject> {
    UIImageView *_lampView;
    UIImageView *_circleView;
    UIImageView *_textView;

    CABasicAnimation *_storedAnimation;  // 从view hierarchy移除时，保存正在执行的动画
}

@property(nonatomic, assign) BOOL ready;
@property(nonatomic, assign) BOOL loading;

@end
